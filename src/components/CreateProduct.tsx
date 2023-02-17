import { FormEventHandler } from 'react';

interface IProps {
  name: string,
  type: string,
  stock: number,
  errors: string[],
  setType: Function,
  setName: Function,
  setStock: Function,
  handleCreateProduct: FormEventHandler<HTMLFormElement>,
}

const RegisterForm = (props: IProps) => {
  const {
    name,
    type,
    stock,
    errors,
    setType,
    setName,
    setStock,
    handleCreateProduct,
  } = props
    
  return (
    <section className="flex flex-col gap-8 min-w-[400px] max-w-[40vw]">
    <span className="text-xl font-bold">Create Product</span>
      <form className="flex flex-col gap-5 w-full" autoComplete="asdasdsa" onSubmit={handleCreateProduct}>
        <div className="flex flex-col gap-2">
          <label className="">Name</label>
          <input
            onInput={(e: any) => setName(e.target.value)}
            placeholder="Product Name"
            className="w-full p-1 border"
            value={name}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="">Type</label>
          <input
            onInput={(e: any) => setType(e.target.value)}
            placeholder="Product Type"
            autoComplete="test@test.com"
            value={type}
            className="w-full p-1 border"
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="">Stock</label>
          <input
            onInput={(e: any) => setStock(e.target.value)}
            placeholder="Stock"
            autoComplete="test@test.com"
            value={stock}
            type="number"
            className="w-full p-1 border"
            required={true}
          />
        </div>
        <input type="submit" hidden/>
      </form>

      <div className="flex justify-center p-2 rounded cursor-pointer w-full bg-blue-600 text-white hover:bg-blue-500" onClick={(e: any) => handleCreateProduct(e)} >Create</div>
      {!!errors && !!errors.length && 
        <ul className="flex flex-col text-red-400">
          {errors.map((e: any) => <li key={e} className="flex items-center">* {e}</li>)}
        </ul>
      }
    </section>
  )
}

export default RegisterForm