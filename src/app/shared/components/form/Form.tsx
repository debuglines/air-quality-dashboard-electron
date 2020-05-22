import React from 'react'

type Props = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  className?: string
}

const Form: React.FC<Props> = (props) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (props.onSubmit) {
      props.onSubmit(event)
    }
  }

  return (
    <form className={props.className} onSubmit={handleSubmit}>
      {props.children}
    </form>
  )
}

export default Form
