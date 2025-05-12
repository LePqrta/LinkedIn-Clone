import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';

const Jobs = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Filters */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filters
            </Typography>
            <TextField
              fullWidth
              placeholder="Search jobs"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Job Type
            </Typography>
            <Box sx={{ mb: 2 }}>
              {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                <Chip
                  key={type}
                  label={type}
                  sx={{ mr: 1, mb: 1 }}
                  variant="outlined"
                />
              ))}
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Experience Level
            </Typography>
            <Box sx={{ mb: 2 }}>
              {['Entry Level', 'Mid-Senior', 'Senior', 'Executive'].map((level) => (
                <Chip
                  key={level}
                  label={level}
                  sx={{ mr: 1, mb: 1 }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Job Listings */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recommended Jobs
            </Typography>
            {[1, 2, 3, 4].map((job) => (
              <Card key={job} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Senior Software Engineer
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Tech Corp
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      San Francisco, CA (Remote)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Full-time
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    We are looking for an experienced software engineer to join our team...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="React" size="small" />
                    <Chip label="TypeScript" size="small" />
                    <Chip label="Node.js" size="small" />
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button variant="contained" color="primary">
                    Apply Now
                  </Button>
                  <Button variant="outlined">Save</Button>
                </CardActions>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Jobs; 