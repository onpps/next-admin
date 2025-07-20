import Swal from 'sweetalert2';

export const sweetAlert = (title, contents, icon, confirmButtonText) => {
    Swal.fire({
        title: title,
        text: contents,
        icon: icon,
        confirmButtonText: confirmButtonText
    });
}

export const sweetConfirm = (title, icon, callback) => {
    Swal.fire({
        title: title,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#4B088A',
        cancelButtonColor: '#01DF01',
        confirmButtonText: '예',
        cancelButtonText: '아니요',
    }).then((result) => {
        if (result.isConfirmed) {
            if (callback) { callback(); }
        }
    })
}

export const sweetToast = (title) => {
    const Toast = Swal.mixin({
        title: title,
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });

    Toast.fire({
        icon: 'success',
        title: title
    });
}