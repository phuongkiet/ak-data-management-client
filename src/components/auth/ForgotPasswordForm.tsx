import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { observer } from 'mobx-react-lite'

import { ChevronLeftIcon } from '../../icons/index.ts'
import ProductLabel from '../form/product-form/ProductLabel.tsx'
import Input from '../form/product-form/input/product/ProductInputField.tsx'
import Button from '../ui/button/Button.tsx'
import { useStore } from '../../app/stores/store.ts'
import { toast } from 'react-toastify'

function ForgotPasswordForm() {
  const { userStore } = useStore()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await userStore.forgotPassword({email: values.email})
        if (result) {
          toast.success('Đã gửi email khôi phục mật khẩu')
          navigate('/reset-password-sent')
        } else {
          toast.error('Không thể gửi email khôi phục mật khẩu')
        }
      } catch (err) {
        toast.error('Đã xảy ra lỗi hệ thống')
        console.error(err)
      } finally {
        setSubmitting(false)
      }
    }
  })

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Trở về
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Quên mật khẩu
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập địa chỉ email để lấy lại mật khẩu
            </p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-6">
              <div>
                <ProductLabel>
                  Email <span className="text-error-500">*</span>
                </ProductLabel>
                <Input
                  id="email"
                  name="email"
                  placeholder="Nhập vào email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && !!formik.errors.email}
                />
                <div className="mt-1">
                  <span className="text-red-500 font-light text-sm italic">
                    {formik.errors.email}
                  </span>
                </div>
              </div>
              <div>
                <Button disabled={formik.isSubmitting} type="submit" className="w-full" size="sm">
                  {formik.isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default observer(ForgotPasswordForm)
