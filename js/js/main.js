/*====================================IMPORT MODULES====================================*/
import { checkAuth, getUserById, logout } from './modules/accountRequests';
import formik from './modules/formik';
import createInputMask from './modules/inputMask';
import { burgerOpener, modalOpener } from './modules/libs';
/*======================================================================================*/

const globalListener = () => {
  AOS.init();
  burgerOpener('burger', 'close', '.overlay-menu', '.menu__item-link');
  modalOpener();
  createInputMask('.phone');
  formik('.auth-form', '.auth-btn');
  formik('.reg-form', '.sign-btn');
  logout('.logout');
  getUserById();
};

window.addEventListener('DOMContentLoaded', globalListener);
