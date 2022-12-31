/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str.trim().length > 3
}

export function validatePhoneNumber(phoneNumber) {
  return !(phoneNumber.length !== 10 && phoneNumber.length !== 11 && phoneNumber[0] !== '0')
}
