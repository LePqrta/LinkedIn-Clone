import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Box } from '../../features/authentication/components/box/Box';
import { Layout } from '../../features/authentication/components/layout/Layout';
import classes from './ErrorBoundary.module.scss';

export function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        // Handle routing errors
        if (error.status === 404) {
            errorMessage = "The page you're looking for doesn't exist.";
        } else if (error.status === 401) {
            errorMessage = "You're not authorized to view this page.";
        } else if (error.status === 403) {
            errorMessage = "You don't have permission to access this page.";
        } else {
            errorMessage = error.data?.message || "Something went wrong.";
        }
    } else if (error instanceof Error) {
        // Handle JavaScript errors
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        // Handle string errors
        errorMessage = error;
    } else {
        // Handle unknown errors
        errorMessage = "An unexpected error occurred.";
    }

    return (
        <Layout className={classes.root}>
            <div className={classes.container}>
                <Box className={classes.errorBox}>
                    <h1>Oops!</h1>
                    <p className={classes.errorMessage}>{errorMessage}</p>
                    <button 
                        className={classes.backButton}
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                    <button 
                        className={classes.homeButton}
                        onClick={() => navigate('/')}
                    >
                        Go to Home
                    </button>
                </Box>
            </div>
        </Layout>
    );
} 