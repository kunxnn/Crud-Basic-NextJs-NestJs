'use client'
import styles from './register.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


function page() {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('http://localhost:3333/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            // console.log('res.ok:', res.ok);
            // console.log('result:', result);
            if (res.ok && result.code === 201) {
                alert(result.message)
                router.push('/login');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert('fetch Failed: ' + error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.login_container}>
                <h2>Register Crud NextJS + NestJS</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" className="form-control" name="firstName" placeholder="firstName" required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" name="lastName" placeholder="lastName" required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" name="username" placeholder="username" required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" name="password" placeholder="password" required />
                    </div>
                    <button type="submit" name="submit" className={styles.login_btn}>sign up</button>
                    <Link href="/login">
                        <button className={styles.login_btn}>sign in</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}
export default page