import { toast } from "@/hooks/use-toast";


function displayErrorMessage(message: string, description?: string) {
    toast({
        title: message,
        description: description,
        style: { background: 'red', color: 'white' }, duration: 2500
    })
}

function displaySuccessMessage(message: string, description?: string) {
    toast({
        title: message,
        description: description,
        style: { background: 'green', color: 'white' }, duration: 1500
    })
}


export { displayErrorMessage , displaySuccessMessage}