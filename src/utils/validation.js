import * as yup from 'yup';
const { parse, isDate } = require('date-fns');

yup.addMethod(yup.string, 'stripEmptyString', function () {
  return this.transform((value) => (value === '' ? undefined : value));
});

// Yup test unique array elements
yup.addMethod(yup.array, 'unique', function (message, mapper = (a) => a) {
  return this.test('unique', message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

export const registerSchema = yup
  .object()
  .shape({
    name: yup
      .string()
      .trim()
      .required('Name cannot be blank!')
      .max(20, 'Name must be no more than 20 characters!'),
    email: yup
      .string()
      .trim()
      .required('Email cannot be blank!')
      .email('Email is invalid!'),
    password: yup
      .string()
      .trim()
      .required('Password cannot be blank!')
      .min(4, 'Password must be between 4 - 10 characters!')
      .max(10, 'Password must be between 4 - 10 characters!'),
  })
  .required();

export const loginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .trim()
      .required('Email cannot be blank!')
      .email('Email is invalid!'),
    password: yup
      .string()
      .trim()
      .required('Password cannot be blank!')
      .min(4, 'Password must be between 4 - 10 characters!')
      .max(10, 'Password must be between 4 - 10 characters!'),
  })
  .required();

export const projectSchema = yup
  .object()
  .shape({
    name: yup
      .string()
      .trim()
      .required('Name cannot be blank!')
      .max(20, 'Name must be no more than 20 characters!'),
    description: yup
      .string()
      .trim()
      .stripEmptyString()
      .max(255, 'Description must be no more than 255 characters!')
      .nullable()
      .default(null),
    deadline: yup
      .date()
      .transform((_value, originalValue) => {
        const parsedDate = isDate(originalValue)
          ? originalValue
          : parse(originalValue, "yyyy-MM-dd'T'HH:mm:ss", new Date());

        return parsedDate;
      })
      .typeError('Invalid date!')
      .min(new Date(Date.now()), 'Deadline must be later than now!'),
  })
  .required();

export const taskSchema = (projectDeadline, isNewTask = true) =>
  yup
    .object()
    .shape({
      name: yup
        .string()
        .trim()
        .required('Name cannot be blank!')
        .max(20, 'Name must be no more than 20 characters!'),
      description: yup
        .string()
        .trim()
        .transform((value, originalValue) =>
          originalValue?.replace(/<(.|\n)*?>/g, '').trim().length === 0
            ? null
            : value
        )
        .nullable()
        .max(255, 'Description must be no more than 255 characters!'),
      deadline: yup
        .date()
        .transform((_value, originalValue) => {
          const parsedDate = isDate(originalValue)
            ? originalValue
            : parse(originalValue, "yyyy-MM-dd'T'HH:mm:ss", new Date());

          return parsedDate;
        })
        .typeError('Invalid date!')
        .min(new Date(Date.now()), 'Deadline must be later than now!')
        .max(
          new Date(projectDeadline),
          'Deadline must not be later than project deadline!'
        ),

      ...(isNewTask && {
        listProjectId: yup.string().trim().uuid().required(),
      }),

      taskMembers: yup.array().required(),
    })
    .required();

export const commentSchema = (isNewComment = true) =>
  yup
    .object()
    .shape({
      content: yup
        .string()
        .trim()
        .test('isCommentEmpty', 'Comment cannot be blank!', (comment) => {
          if (comment?.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
            return false;
          }
          return true;
        })
        .max(255, 'Comment must be no more than 255 characters!'),

      ...(isNewComment && { taskId: yup.string().trim().uuid().required() }),
    })
    .required();
