import { EmailAuthProvider } from 'firebase/auth';

const authConfig = {
    signInOptions: [
        {
            provider: EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        }
    ],
    callbacks:{
        signInSuccessWithAuthResult: () => false,
    }
}
export default authConfig;