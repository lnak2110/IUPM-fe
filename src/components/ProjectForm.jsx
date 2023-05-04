import { useSelector } from 'react-redux';
import { theme } from '../App';
import Loading from './Loading';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProjectForm = ({
  handleSubmit,
  onSubmit,
  reset,
  formType = 'create',
  isSubmitting,
  formFieldElements,
}) => {
  const { isLoading } = useSelector((state) => state.projectReducer);

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md">
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ pb: 4 }}>
          {`${formType === 'edit' ? 'Edit' : 'Create'} Project`}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {formFieldElements[3] && (
              <Grid item xs={12}>
                {formFieldElements[3]}
              </Grid>
            )}
            <Grid item xs={12}>
              {formFieldElements[0]}
            </Grid>
            <Grid item xs={12}>
              {formFieldElements[1]}
            </Grid>
            <Grid item xs={12}>
              {formFieldElements[2]}
            </Grid>
            {downSm ? (
              <Grid container item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Create project
                </Button>
                <Button variant="outlined" fullWidth onClick={() => reset()}>
                  Reset
                </Button>
              </Grid>
            ) : (
              <Grid container item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mr: 2 }}
                  disabled={isSubmitting}
                >
                  {`${formType === 'update' ? 'Update' : 'Create'} Project`}
                </Button>
                <Button variant="outlined" onClick={() => reset()}>
                  Reset
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
      {isLoading && <Loading />}
    </Container>
  );
};

export default ProjectForm;
