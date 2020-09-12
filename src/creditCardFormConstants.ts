import { faCcAmex, faCcDinersClub, faCcDiscover, faCcJcb, faCcMastercard, faCcVisa, IconDefinition } from "@fortawesome/free-brands-svg-icons"

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December']
export const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
export const ICONS: IconDefinition[] = [faCcVisa, faCcMastercard, faCcDiscover, faCcDinersClub, faCcJcb, faCcAmex]
export const FIELD_LABEL = {
    CARD_NUMBER: 'CARD NUMBER',
    CVC: 'CVC',
    CARD_HOLDER_NAME: 'CARD HOLDER NAME',
    EXPIRATION_DATE: 'EXPIRATION DATE',
    PAY: 'PAY'
  }
export const FIELD_ID = {
    card_number: 'card_number',
    cvc: 'cvc',
    card_holder_name: 'card_holder_name',
    expiration_date: {
        month: 'month',
        year: 'year'
    }
}