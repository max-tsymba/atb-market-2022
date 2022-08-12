/*=====================================BURGER MENU======================================*/
const burgerOpener = (burgerID, closeID, menuSelector, menuLinksSelector) => {

    const burgerBtn = document.getElementById(burgerID),
        menu = document.querySelector(menuSelector),
        closeBtn = document.getElementById(closeID),
        links = document.querySelectorAll(menuLinksSelector);

    let scroll = calcScroll();

    if(burgerBtn !== null) {
        burgerBtn.addEventListener('click', () => {

            menu.classList.add('opened');
            document.body.style.overflowY = 'hidden';
        });

        closeBtn.addEventListener('click', () => {
                menu.classList.remove('opened');
                document.body.style.overflowY = 'scroll';
        })

        links.forEach((link) => {
            link.addEventListener('click', () => {

                menu.classList.remove('opened');
                document.body.style.overflowY = 'scroll';
            });
        });

        menu.addEventListener('click', (e) => {

            if(e.target === menu) {

                menu.classList.remove('opened');
                document.body.style.overflowY = 'scroll';
            }
        });
    }
}
/*======================================================================================*/


/*=====================================MODAL OPENER=====================================*/
const modalOpener = () => {

    function bindModal(overlaySelector, formID, openBtnSelector, closeBtnSelector, inputWrapperSelector = null, errorLabel = null) {

        const overlay = document.querySelector(overlaySelector),
            modal = document.getElementById(formID),
            openBtn = document.querySelectorAll(openBtnSelector),
            closeBtn = document.querySelectorAll(closeBtnSelector);

        let removeScroll = calcScroll();
        let isWrapper = false;

        if(inputWrapperSelector !== null) {
            const wrappers = document.querySelectorAll(inputWrapperSelector),
                labels = document.querySelectorAll(errorLabel);
            isWrapper = true;
        }

        if(modal !== null) {

                let user_id = readCookie('user_id');

                function readCookie(name) {
                    let matches = document.cookie.match(new RegExp(
                        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                    ));
                    return matches ? decodeURIComponent(matches[1]) : undefined;
                }

                if(user_id && modal.id === 'modal-auth') {
                    openBtn.forEach(btn=>{
                    
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            window.location.href = '/account.html';
                        })
                    })
                } else {
                    
                        openBtn.forEach(btn => {

                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                overlay.classList.add('active');
                                modal.classList.add('active');
                                document.body.style.overflowY = 'hidden';
                                document.body.style.marginRight = `${scroll}px`; 
                            });
                        });

                        closeBtn.forEach(btn => {

                            btn.addEventListener('click', () => {
                                
                                overlay.classList.remove('active');
                                modal.classList.remove('active');
                                document.body.style.overflowY = 'scroll';
                                document.body.style.marginRight = `0px`; 

                                if(isWrapper) {
                                    clearErrors(labels, wrappers);
                                    Reset(modal);
                                }
                            });
                        });

                        overlay.addEventListener('click', (e) => {

                            if(e.target === overlay) {
                
                                overlay.classList.remove('active');
                                modal.classList.remove('active');
                                document.body.style.overflowY = 'scroll';
                                document.body.style.marginRight = `0px`; 

                                if(isWrapper) {
                                    clearErrors(labels, wrappers);
                                    Reset(modal);
                                }
                            }
                        });
                }

        };

    };

    bindModal('#overlay-auth', 'modal-auth', '.auth-open', '.close-auth-modal');
    bindModal('#overlay-reg', 'modal-reg', '.reg-btn', '.close-reg-modal');
    
}

function calcScroll() {
        
    let div = document.createElement('div');

    div.style.width = '50px';
    div.style.height = '50px';
    div.style.overflowY = 'scroll';
    div.style.visibility = 'hidden';

    document.body.appendChild(div);

    let scrollWidth = div.offsetWidth - div.clientWidth;
    div.remove();

    return scrollWidth;
}

function clearErrors(labelError, inputsError) {

    labelError.forEach(item => {
            item.style.display = 'none';
    });

    inputsError.forEach(item => {
        item.classList.remove('_error');
    });
}

function Reset(form) {
    form.reset();
}
/*======================================================================================*/

export { burgerOpener, modalOpener };