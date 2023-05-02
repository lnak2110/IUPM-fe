import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useTitle from '../../hooks/useTitle';
import {
  createProjectAPI,
  setFalseProjectFulfilledAction,
} from '../../redux/reducers/projectReducer';
import { projectSchema } from '../../utils/validation';
import ControllerDateTimePicker from '../../components/ControllerDateTimePicker';
import ControllerTextField from '../../components/ControllerTextField';
import ProjectForm from '../../components/ProjectForm';

const CreateProject = () => {
  const { projectFulfilled } = useSelector((state) => state.projectReducer);
  const dispatch = useDispatch();

  useTitle('Create Project');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      deadline: null,
      description: '',
    },
    mode: 'onTouched',
    resolver: yupResolver(projectSchema),
  });

  const onSubmit = (data) => {
    dispatch(createProjectAPI(data));
    console.log(data);
  };

  useEffect(() => {
    if (projectFulfilled) {
      reset();
      dispatch(setFalseProjectFulfilledAction());
    }
  }, [projectFulfilled, reset, dispatch]);

  return (
    <ProjectForm
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      reset={reset}
      formFieldElements={[
        <ControllerTextField
          control={control}
          name="name"
          id="create-project-name"
          label="Name"
        />,
        <ControllerDateTimePicker
          control={control}
          name="deadline"
          id="create-project-deadline"
          label="Deadline"
        />,
        <ControllerTextField
          control={control}
          name="description"
          id="create-project-description"
          label="Description"
          placeholder="Describe the project..."
          isRequired={false}
        />,
      ]}
    />
  );
};

export default CreateProject;
