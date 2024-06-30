import { EmailAuthProvider } from 'firebase/auth';

const authConfig = {
    signInOptions: [
        {
            provider: EmailAuthProvider.PROVIDER_ID,
            
        }
    ],
    signInSuccessUrl: '/'
}
export default authConfig;