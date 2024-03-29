import * as yup from 'yup'

export const validationSchema = yup.object().shape({
  title: yup.string().required('Field is required')
    .matches(/^[a-zA-Zа-яА-ЯЁё ]*$/, 'Only letters are allowed'),
  price: yup.number().typeError('Only numbers are allowed').required('Field is required'),
  discount: yup.number(),
  type: yup.string().required('Field is required'),
  size: yup.string().required('Field is required')
})
