import { useState } from 'react'
import { Link } from 'react-router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { observer } from 'mobx-react-lite'

import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '../../icons'
import ProductLabel from '../form/product-form/ProductLabel.tsx'
import Input from '../form/product-form/input/product/ProductInputField.tsx'
import Button from '../ui/button/Button'
import { useStore } from '../../app/stores/store.ts'
import { toast } from 'react-toastify'

function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { userStore } = useStore()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
      password: Yup.string().required('Bắt buộc')
    }),
    onSubmit: async (values, {setSubmitting}) => {
      try {
        const res = await userStore.login(values);

        if (res.success) {
          toast.success("Đăng nhập thành công.")
        }
        setSubmitting(false);
      } catch (err) {
        toast.error("Đã xảy ra lỗi hệ thống.");
        console.error(err);
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
          Trở về trang chủ
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập địa chỉ email để đăng nhập
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
                <ProductLabel>
                  Mật khẩu <span className="text-error-500">*</span>
                </ProductLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập vào mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && !!formik.errors.password}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                  <div className="mt-1">
                    <span className="text-red-500 mt-5 font-light text-sm italic">
                      {formik.errors.password}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div>
                <Button disabled={formik.isSubmitting} type="submit" className="w-full" size="sm">
                  Đăng nhập
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default observer(SignInForm)
