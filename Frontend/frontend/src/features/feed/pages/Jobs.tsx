import { useState, useEffect } from 'react';
import { Navbar } from '../../../component/Navbar';
import feedClasses from './Feed.module.scss';
import { useNavigate, Link } from 'react-router-dom';

// UserResponse DTO (matching backend response)
interface UserResponse {
    id: string;
    username: string;
    email: string;
    name: string | null;
    surname: string | null;
    role: string;
}

interface JobResponse {
    jobId: number;
    title: string;
    description: string;
    companyName: string;
    location: string;
    user: UserResponse;
    postedAt: string;
}

interface ApplicationResponse {
    applicationId: number;
    user: UserResponse;
    coverLetter: string;
    appliedAt: string;
}

export function Jobs() {
    const [form, setForm] = useState({
        companyName: '',
        title: '',
        description: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [applyLoading, setApplyLoading] = useState(false);
    const [applySuccess, setApplySuccess] = useState('');
    const [applyError, setApplyError] = useState('');
    const [myJobs, setMyJobs] = useState<JobResponse[]>([]);
    const [unappliedJobs, setUnappliedJobs] = useState<JobResponse[]>([]);
    const [appliedJobs, setAppliedJobs] = useState<JobResponse[]>([]);
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);
    const [applications, setApplications] = useState<ApplicationResponse[]>([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [applicationsError, setApplicationsError] = useState('');
    const [selectedApplicationsJobId, setSelectedApplicationsJobId] = useState<number | null>(null);
    const [appliedJobsSearch, setAppliedJobsSearch] = useState('');
    const [unappliedJobsSearch, setUnappliedJobsSearch] = useState('');
    const [myJobsSearch, setMyJobsSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const response = await fetch('http://localhost:8080/jobs/get-jobs-created', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await response.json();
                setMyJobs(data);
            } catch (err) {
                console.error('Error fetching jobs:', err);
            }
        };
        fetchMyJobs();
    }, []);

    useEffect(() => {
        const fetchUnappliedJobs = async () => {
            try {
                const response = await fetch('http://localhost:8080/jobs/get-jobs-not-applied', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch unapplied jobs');
                }
                const data = await response.json();
                setUnappliedJobs(data);
            } catch (err) {
                console.error('Error fetching unapplied jobs:', err);
            }
        };
        fetchUnappliedJobs();
    }, []);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const response = await fetch('http://localhost:8080/jobs/get-jobs-applied', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch applied jobs');
                }
                const data = await response.json();
                setAppliedJobs(data);
            } catch (err) {
                console.error('Error fetching applied jobs:', err);
            }
        };
        fetchAppliedJobs();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
        try {
            const response = await fetch('http://localhost:8080/jobs/create-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(form),
                credentials: 'include',
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to create job');
            }
            setSuccess('Job created successfully!');
            setForm({ companyName: '', title: '', description: '', location: '' });
            setShowModal(false); // Close modal on success
            // Refresh the job list
            const updatedResponse = await fetch('http://localhost:8080/jobs/get-jobs-created', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
            });
            if (updatedResponse.ok) {
                const updatedData = await updatedResponse.json();
                setMyJobs(updatedData);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJobId) return;
        
        setApplyLoading(true);
        setApplySuccess('');
        setApplyError('');
        
        try {
            const response = await fetch(`http://localhost:8080/application/apply/${selectedJobId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ coverLetter }),
                credentials: 'include',
            });
            
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to apply for job');
            }
            
            setApplySuccess('Successfully applied for the job!');
            setCoverLetter('');
            setShowApplyModal(false);
            
            // Refresh the job lists
            const [unappliedResponse, appliedResponse] = await Promise.all([
                fetch('http://localhost:8080/jobs/get-jobs-not-applied', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    credentials: 'include',
                }),
                fetch('http://localhost:8080/jobs/get-jobs-applied', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    credentials: 'include',
                })
            ]);
            
            if (unappliedResponse.ok && appliedResponse.ok) {
                const [unappliedData, appliedData] = await Promise.all([
                    unappliedResponse.json(),
                    appliedResponse.json()
                ]);
                setUnappliedJobs(unappliedData);
                setAppliedJobs(appliedData);
            }
        } catch (err: any) {
            setApplyError(err.message || 'Failed to apply for job');
        } finally {
            setApplyLoading(false);
        }
    };

    const filterJobs = (jobs: JobResponse[], searchTerm: string): JobResponse[] => {
        if (!searchTerm) return jobs;
        const lowerSearch = searchTerm.toLowerCase();
        return jobs.filter((job) =>
            job.companyName.toLowerCase().includes(lowerSearch) ||
            job.title.toLowerCase().includes(lowerSearch) ||
            job.description.toLowerCase().includes(lowerSearch) ||
            job.location.toLowerCase().includes(lowerSearch)
        );
    };

    const filteredAppliedJobs = filterJobs(appliedJobs, appliedJobsSearch);
    const filteredUnappliedJobs = filterJobs(unappliedJobs, unappliedJobsSearch);
    const filteredMyJobs = filterJobs(myJobs, myJobsSearch);

    return (
        <>
            <Navbar />
            <div className={feedClasses.root}>
                <main className={feedClasses.content} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', padding: '20px' }}>
                    <div className={feedClasses.center} style={{ width: '100%', maxWidth: 1400, margin: '0 auto' }}>
                        {showModal && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                background: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <div style={{ background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 2px 16px rgba(33,147,176,0.15)', maxWidth: 600, width: '100%', position: 'relative' }}>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}
                                        aria-label="Close"
                                    >
                                        ×
                                    </button>
                                    <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Create Job</h2>
                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <input
                                            name="companyName"
                                            value={form.companyName}
                                            onChange={handleChange}
                                            placeholder="Company Name"
                                            required
                                            style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                                        />
                                        <input
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            placeholder="Job Title"
                                            required
                                            style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                                        />
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Description"
                                            required
                                            rows={4}
                                            style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                                        />
                                        <input
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            placeholder="Location"
                                            required
                                            style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{ padding: 12, borderRadius: 8, background: '#0a66c2', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}
                                        >
                                            {loading ? 'Creating...' : 'Create Job'}
                                        </button>
                                        {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
                                        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                                    </form>
                                </div>
                            </div>
                        )}

                        {showApplyModal && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                background: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <div style={{ background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 2px 16px rgba(33,147,176,0.15)', maxWidth: 600, width: '100%', position: 'relative' }}>
                                    <button
                                        onClick={() => setShowApplyModal(false)}
                                        style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}
                                        aria-label="Close"
                                    >
                                        ×
                                    </button>
                                    <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Apply for Job</h2>
                                    <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <textarea
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                            placeholder="Cover Letter"
                                            required
                                            rows={6}
                                            style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={applyLoading}
                                            style={{ padding: 12, borderRadius: 8, background: '#0a66c2', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}
                                        >
                                            {applyLoading ? 'Applying...' : 'Apply'}
                                        </button>
                                        {applySuccess && <div style={{ color: 'green', marginTop: 8 }}>{applySuccess}</div>}
                                        {applyError && <div style={{ color: 'red', marginTop: 8 }}>{applyError}</div>}
                                    </form>
                                </div>
                            </div>
                        )}

                        {showApplicationsModal && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                background: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <div style={{ background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 2px 16px rgba(33,147,176,0.15)', maxWidth: 600, width: '100%', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
                                    <button
                                        onClick={() => setShowApplicationsModal(false)}
                                        style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}
                                        aria-label="Close"
                                    >
                                        ×
                                    </button>
                                    <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Applications</h2>
                                    {applicationsLoading ? (
                                        <div>Loading...</div>
                                    ) : applicationsError ? (
                                        <div style={{ color: 'red' }}>{applicationsError}</div>
                                    ) : applications.length === 0 ? (
                                        <div>No applications found for this job.</div>
                                    ) : (
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {applications.map((app) => (
                                                <li key={app.applicationId} style={{ background: '#f7fafd', borderRadius: 8, padding: 16, marginBottom: 16, boxShadow: '0 1px 4px rgba(33,147,176,0.05)' }}>
                                                    <Link
                                                        to={`/profile/${app.user.username}`}
                                                        style={{ fontWeight: 600, fontSize: 16, color: '#0a66c2', textDecoration: 'underline', display: 'inline-block' }}
                                                        title="Go to profile"
                                                    >
                                                        {app.user.username}
                                                    </Link>
                                                    <div style={{ color: '#666', fontSize: 14 }}>{app.user.email}</div>
                                                    <div style={{ margin: '8px 0', fontSize: 15 }}><b>Cover Letter:</b> {app.coverLetter}</div>
                                                    <div style={{ color: '#888', fontSize: 13 }}>Applied: {new Date(app.appliedAt).toLocaleString()}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '24px', 
                            width: '100%', 
                            maxWidth: 1400, 
                            margin: '0 auto',
                            padding: '0 20px'
                        }}>
                            <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(33,147,176,0.07)' }}>
                                <h2 style={{ marginBottom: 16, fontSize: 24, fontWeight: 600, color: '#0a66c2' }}>Applied Jobs</h2>
                                <div style={{ marginBottom: 16 }}>
                                    <input
                                        type="text"
                                        value={appliedJobsSearch}
                                        onChange={(e) => setAppliedJobsSearch(e.target.value)}
                                        placeholder="Search applied jobs..."
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: 8,
                                            border: '1px solid #ddd',
                                            fontSize: 14
                                        }}
                                    />
                                </div>
                                {filteredAppliedJobs.length === 0 ? (
                                    <p>{appliedJobsSearch ? 'No matching jobs found.' : 'No applied jobs available.'}</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {filteredAppliedJobs.map((job) => (
                                            <li key={job.jobId} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(33,147,176,0.07)' }}>
                                                <h3 style={{ margin: 0, fontSize: 18 }}>{job.title}</h3>
                                                <p style={{ margin: '8px 0', color: '#666' }}>{job.companyName}</p>
                                                <p style={{ margin: '8px 0' }}>{job.description}</p>
                                                <p style={{ margin: '8px 0', color: '#666' }}>Location: {job.location}</p>
                                                <p style={{ margin: '8px 0', color: '#666' }}>Posted: {new Date(job.postedAt).toLocaleDateString()}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(33,147,176,0.07)' }}>
                                <h2 style={{ marginBottom: 16, fontSize: 24, fontWeight: 600, color: '#0a66c2' }}>Unapplied Jobs</h2>
                                <div style={{ marginBottom: 16 }}>
                                    <input
                                        type="text"
                                        value={unappliedJobsSearch}
                                        onChange={(e) => setUnappliedJobsSearch(e.target.value)}
                                        placeholder="Search unapplied jobs..."
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: 8,
                                            border: '1px solid #ddd',
                                            fontSize: 14
                                        }}
                                    />
                                </div>
                                {filteredUnappliedJobs.length === 0 ? (
                                    <p>{unappliedJobsSearch ? 'No matching jobs found.' : 'No unapplied jobs available.'}</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {filteredUnappliedJobs.map((job) => (
                                            <li key={job.jobId} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(33,147,176,0.07)' }}>
                                                <h3 style={{ margin: 0, fontSize: 18 }}>{job.title}</h3>
                                                <p style={{ margin: '8px 0', color: '#666' }}>{job.companyName}</p>
                                                <p style={{ margin: '8px 0' }}>{job.description}</p>
                                                <p style={{ margin: '8px 0', color: '#666' }}>Location: {job.location}</p>
                                                <p style={{ margin: '8px 0', color: '#666' }}>Posted: {new Date(job.postedAt).toLocaleDateString()}</p>
                                                <button
                                                    onClick={() => {
                                                        setSelectedJobId(job.jobId);
                                                        setShowApplyModal(true);
                                                    }}
                                                    style={{ 
                                                        padding: '8px 16px', 
                                                        borderRadius: 24, 
                                                        background: '#0a66c2', 
                                                        color: 'white', 
                                                        fontWeight: 600, 
                                                        fontSize: 14, 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        marginTop: 8
                                                    }}
                                                >
                                                    Apply
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(33,147,176,0.07)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h2 style={{ fontSize: 24, fontWeight: 600, color: '#0a66c2' }}>My Job Posts</h2>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        style={{ padding: '10px 20px', borderRadius: 24, background: '#0a66c2', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(33,147,176,0.07)' }}
                                    >
                                        + Create Job
                                    </button>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <input
                                        type="text"
                                        value={myJobsSearch}
                                        onChange={(e) => setMyJobsSearch(e.target.value)}
                                        placeholder="Search my job posts..."
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: 8,
                                            border: '1px solid #ddd',
                                            fontSize: 14
                                        }}
                                    />
                                </div>
                                {filteredMyJobs.length === 0 ? (
                                    <p>{myJobsSearch ? 'No matching jobs found.' : 'No jobs posted yet.'}</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {filteredMyJobs.map((job) => (
                                            <li key={job.jobId} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(33,147,176,0.07)', position: 'relative' }}>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const response = await fetch(`http://localhost:8080/jobs/delete-job/${job.jobId}`, {
                                                                method: 'DELETE',
                                                                headers: {
                                                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                                                },
                                                                credentials: 'include',
                                                            });
                                                            if (!response.ok) {
                                                                throw new Error('Failed to delete job');
                                                            }
                                                            // Refresh the job list
                                                            const updatedResponse = await fetch('http://localhost:8080/jobs/get-jobs-created', {
                                                                headers: {
                                                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                                                },
                                                                credentials: 'include',
                                                            });
                                                            if (updatedResponse.ok) {
                                                                const updatedData = await updatedResponse.json();
                                                                setMyJobs(updatedData);
                                                            }
                                                        } catch (err) {
                                                            console.error('Error deleting job:', err);
                                                        }
                                                    }}
                                                    style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}
                                                    aria-label="Delete"
                                                >
                                                    ×
                                                </button>
                                                <h3 style={{ margin: 0, fontSize: 18 }}>{job.title}</h3>
                                                <p style={{ margin: '8px 0', color: '#666' }}>{job.companyName}</p>
                                                <p style={{ margin: '8px 0' }}>{job.description}</p>
                                                <p style={{ margin: '8px 0', color: '#666' }}>Location: {job.location}</p>
                                                <p style={{ margin: '8px 0', color: '#666' }}>Posted: {new Date(job.postedAt).toLocaleDateString()}</p>
                                                <button
                                                    onClick={async () => {
                                                        setSelectedApplicationsJobId(job.jobId);
                                                        setShowApplicationsModal(true);
                                                        setApplications([]);
                                                        setApplicationsError('');
                                                        setApplicationsLoading(true);
                                                        try {
                                                            const response = await fetch(`http://localhost:8080/application/get-applications/${job.jobId}`, {
                                                                headers: {
                                                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                                                },
                                                                credentials: 'include',
                                                            });
                                                            if (!response.ok) {
                                                                throw new Error('Failed to fetch applications');
                                                            }
                                                            const data = await response.json();
                                                            setApplications(data);
                                                        } catch (err: any) {
                                                            setApplicationsError(err.message || 'Failed to fetch applications');
                                                        } finally {
                                                            setApplicationsLoading(false);
                                                        }
                                                    }}
                                                    style={{ 
                                                        padding: '8px 16px', 
                                                        borderRadius: 24, 
                                                        background: '#e6f0fa', 
                                                        color: '#0a66c2', 
                                                        fontWeight: 600, 
                                                        fontSize: 14, 
                                                        border: 'none', 
                                                        cursor: 'pointer',
                                                        marginTop: 8
                                                    }}
                                                >
                                                    See Applications
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <footer>
                    <ul className={feedClasses.footerContainer}>
                        <li>
                            <img alt="" src="/logo-dark.svg" />
                            <span>2025</span>
                        </li>
                        <li><a href="">Accessibility</a></li>
                        <li><a href="">User Agreement</a></li>
                        <li><a href="">Privacy Policy</a></li>
                        <li><a href="">Cookie Policy</a></li>
                        <li><a href="">Copyright Policy</a></li>
                        <li><a href="">Brand Policy</a></li>
                        <li><a href="">Guest Controls</a></li>
                        <li><a href="">Community Guidelines</a></li>
                        <li><a href="">Language</a></li>
                    </ul>
                </footer>
            </div>
        </>
    );
} 