import { InterfaceToastProps } from 'native-base/lib/typescript/components/composites/Toast';

export async function createToast(toast, title: string, error = true, placement: InterfaceToastProps['placement'] = 'top'){
    
    return toast.show({
        title,
        placement,
        bgColor: error ? 'red.500' : 'green.500'
    })
}