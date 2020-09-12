// eslint-disable-next-line no-use-before-define
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button, Dropdown, Form } from 'semantic-ui-react'
import { FIELD_ID, FIELD_LABEL, ICONS, MONTHS, YEARS } from './creditCardFormConstants'
import { transacionStore } from './TransactionStore'

/**Reusable interface to iterate over object keys */
export interface IndexableObject {
  [key: string]: any
}

/**Describes form initial data */
interface FormInitialData extends IndexableObject {
  card_number: '',
  cvc: '',
  card_holder_name: '',
  expiration_date: {
    month: '' ,
    year: ''
  }
}

/**Describes error object */
interface Error extends IndexableObject {
  card_number: { error: boolean, errorMessage: string},
    cvc: { error: boolean, errorMessage: string},
    card_holder_name: { error: boolean, errorMessage: string},
    expiration_date: {
      month: { error: boolean},
      year:  { error: boolean}
    } 
}



/**Discribes form props passed create form */
interface FormProps {
  value?: any
  label: string
  errorMessage?: string
  error: any
  id: any
  maxLength?: string
  years?: string[]
  months?: string[]
  placeholder: any
}
/**Describes dropdown options text/value pairs */
interface TextValuePair {
  text: string
  value: string
}

/**
 * Function creates text/value pairs for semantic-ui dropdown options
 * @param data Data array
 */
const createTextValuePair = (data: string[]) => {
  const textValueArray: TextValuePair[]  = []
  data.forEach((item, index) => {
      textValueArray.push({text: item, value: item})
  })
  return textValueArray
}

export const CreditCardForm = (): React.ReactElement => {
  const error: Error = {
    card_number: { error: false, errorMessage: 'Please 16 characters, no spaces and only numeric values'},
    cvc: { error: false, errorMessage: 'Please 3 characters, no spaces and only numeric values'},
    card_holder_name: { error: false, errorMessage: 'Required field'},
    expiration_date: {
      month: { error: false},
      year:  { error: false}
    } 
  }

  const formInitialData: FormInitialData = {
    card_number: '',
    cvc: '',
    card_holder_name: '',
    expiration_date: {
      month: '' ,
      year: ''
    }
  }

  const [formData, setFormData] = React.useState<FormInitialData>(formInitialData)
  const [formError, setFormError] = React.useState<Error>(error)
  const [loading, setLoading] = React.useState<boolean>(false)

  const formProps: FormProps[] = [
    {
      id: FIELD_ID.card_number,
      label: FIELD_LABEL.CARD_NUMBER, 
      value: formData.card_number, 
      error: formError.card_number.error,  
      errorMessage: formError.card_number.errorMessage, 
      maxLength: '16',
      placeholder: '4444555566667777'
    },
    {
      id: FIELD_ID.cvc, 
      label: FIELD_LABEL.CVC, 
      value: formData.cvc,
      error: formError.cvc.error,
      errorMessage: formError.cvc.errorMessage,
      maxLength: '3',
      placeholder: '123'
    },
    {
      id: FIELD_ID.card_holder_name, 
      label: FIELD_LABEL.CARD_HOLDER_NAME, 
      value: formData.card_holder_name,
      error: formError.card_holder_name.error,
      errorMessage: formError.card_holder_name.errorMessage,
      maxLength: '24',
      placeholder: 'John Dow'
    },
    { 
      id: { month: FIELD_ID.expiration_date.month, year: FIELD_ID.expiration_date.year }, 
      label: FIELD_LABEL.EXPIRATION_DATE, 
      value: { month: formData.expiration_date.month, year: formData.expiration_date.year },
      error: { month: formError.expiration_date.month.error, year: formError.expiration_date.year.error },
      years: YEARS, 
      months: MONTHS,
      placeholder: { month: 'January', year: '2020'}
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, data: {id: string, value: string}) => {
    const { id, value } = data
    validateInputField(id, value)
    setFormData({...formData, [id]: value })
  }

  const handleDropdownChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: { id: string, value: any} ) => {
    const { id, value } = data
    setFormData({...formData, expiration_date: {...formData.expiration_date, [id]: value}})
    if(value.length > 0) {
      setFormError({...formError, expiration_date: { ...formError.expiration_date, [id]: false } })
    }
  }

  /**Function does very basic validation of card number, cvc fields on invalid characters and removes error message 
   * for card holder name when length > 0, because error should be removed when user start typing  
   */
  const validateInputField = (id: string , value: string): void=> {
    switch(id) {
      case (FIELD_ID.card_number):
        case (FIELD_ID.cvc):
          if(isNaN(Number(value))){
            setFormError({ ...formError, [id]: { ...formError[id], error: true }})
          } 
          else {
            setFormError({ ...formError, [id]: { ...formError[id], error: false }})
          }
            break
      case (FIELD_ID.card_holder_name):
        if(value.length > 0) {
          setFormError({ ...formError, [id]: { ...formError[id], error: false }})
        }
      break
    }
  }

  /**
   * Function saves data to simple store
   * @param formData Current data
   */
  const handleSubmit = async(formData: FormInitialData) => {
    if(validateRequiredFields(formData)) {
      setLoading(true)
      const result = await transacionStore.addTransaction(formData)
      if(result){
        setLoading(false)
        setFormData(formInitialData)
      }
      /**Logging for demo reason */
      console.log(transacionStore.values)
    }
  }

  /** Function checks on min required field length and sets the errors, max length is handled by semantic-ui*/
  const validateRequiredFields = (formData: FormInitialData): boolean => {
    let isValidated = true 
    for(let key in formData) {
      if(key === FIELD_ID.card_number && formData[key].length < 16) {
        setFormError({...formError, [key]: { ...formError[key], error: true } })
        isValidated = false
        break
      } else if (key === FIELD_ID.cvc && formData[key].length < 3) {
        setFormError({...formError, [key]: { ...formError[key], error: true } })
        isValidated = false
        break
      } else if (key === FIELD_ID.card_holder_name && formData[key].length === 0) {
        setFormError({...formError, [key]: { ...formError[key], error: true } })
        isValidated = false
        break
      } else if (Object.keys(formData[key])[0] === FIELD_ID.expiration_date.month && formData[key].month.length === 0) {
        setFormError({...formError, [key]: { ...formError[key], month: { error: true} } })
        isValidated = false
        break
      } else if (Object.keys(formData[key])[1] === FIELD_ID.expiration_date.year && formData[key].year.length === 0) {
        setFormError({...formError, [key]: { ...formError[key], year: { error: true} } })
        isValidated = false
        break
      }
    }
    return isValidated
  }

  const renderFormFields = (formProps: FormProps[]): React.ReactElement[] => {
    const items: React.ReactElement[] = formProps.map((item: FormProps, index: number) => {
        if(item.label === FIELD_LABEL.EXPIRATION_DATE && item.months && item.years) {
            return (
              <div key={index}>
                  <label className='expiry-date-label'>{item.label}</label>
                  <div className='expiry-date-dropdown'>
                    <Dropdown
                      id={item.id.month}
                      placeholder={item.placeholder.month} 
                      value={item.value.month}
                      selection 
                      error={item.error.month}
                      options={createTextValuePair(item.months)}
                      onChange={(e, data) => handleDropdownChange(e, { id: data.id, value: data.value })}
                      className='month'
                    />
                    <Dropdown
                      id={item.id.year} 
                      placeholder={item.placeholder.year}
                      value={item.value.year}
                      selection 
                      error={item.error.year}
                      options={createTextValuePair(item.years)}
                      onChange={(e, data) => handleDropdownChange(e, { id: data.id, value: data.value })}
                      className='year'
                    />
                  </div>
              </div>
            )
        } 
        return (
            <Form.Input
              key={index}
              id={item.id}
              placeholder={item.placeholder}
              value={(item.id === FIELD_ID.card_holder_name) ? item.value : item.value.replace(/\s/g, "")}
              label={item.label}
              maxLength={item.maxLength}
              error={item.error ? item.errorMessage : false}
              onChange={(e, data) => handleInputChange(e, {id: data.id, value: data.value})}
              className={`${item.id}`}
            />
          )
    })
    return items
  }

  const renderFormIcons = (icons: IconDefinition[]) => {
    const items = icons.map((name: IconDefinition, index: number) => {
      return <FontAwesomeIcon color='#0474bf' className='credit-icons' size='2x' key={index} icon={name}/>
    })
    return items
  }

  return (
      <Form>
        {renderFormIcons(ICONS)}
        {renderFormFields(formProps)}
        <Button color='blue' className='form-button' loading={loading} onClick={() => handleSubmit(formData)}>{FIELD_LABEL.PAY}</Button>
      </Form>
  ) 
} 