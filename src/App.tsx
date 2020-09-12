import * as React from 'react'

type Props = { children: React.ReactNode }

export const App = (props: Props): React.ReactElement => {
    const { children } = props
    return (
        <div className='container'>
            {children}
        </div>
    )
}