import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getProjectDetailAPI,
  updateProjectAPI,
} from '../../redux/reducers/projectReducer';
import { projectSchema } from '../../utils/validation';
import ControllerDateTimePicker from '../../components/ControllerDateTimePicker';
import ControllerTextField from '../../components/ControllerTextField';
import Loading from '../../components/Loading';
import ProjectForm from '../../components/ProjectForm';

const UpdateProject = () => {
  const { projectDetail, isLoading } = useSelector(
    (state) => state.projectReducer
  );
  const dispatch = useDispatch();

  const { projectId } = useParams();

  const initialValues = useMemo(
    () => ({
      name: projectDetail?.name || '',
      deadline:
        (projectDetail?.deadline && new Date(projectDetail.deadline)) || null,
      description: projectDetail?.description || '',
    }),
    [projectDetail]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialValues,
    mode: 'onTouched',
    resolver: yupResolver(projectSchema),
  });

  const onSubmit = (data) => {
    dispatch(updateProjectAPI({ ...data, id: projectId }));
  };

  useEffect(() => {
    dispatch(getProjectDetailAPI(projectId));
  }, [dispatch, projectId]);

  // Reset defaultvalues after received data from API
  useEffect(() => {
    if (projectDetail) {
      reset({ ...initialValues });
    }
  }, [reset, projectDetail, initialValues]);

  return (
    <>
      <ProjectForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        formType="update"
        isSubmitting={isSubmitting}
        reset={reset}
        formFieldElements={[
          <ControllerTextField
            control={control}
            name="name"
            id="update-project-name"
            label="Name"
          />,
          <ControllerDateTimePicker
            control={control}
            name="deadline"
            id="update-project-deadline"
            label="Deadline"
          />,
          <ControllerTextField
            control={control}
            name="description"
            id="update-project-description"
            label="Description"
            placeholder="Describe the project..."
            isRequired={false}
          />,
        ]}
      />
      {isLoading && <Loading />}
    </>
  );
};

export default UpdateProject;
