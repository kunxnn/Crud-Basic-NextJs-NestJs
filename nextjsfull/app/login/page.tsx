'use client'
import { useState } from 'react';
import styles from './login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3333/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });
            const result = await res.json();
            
            if (res.ok && result.code === 200) {
                alert(result.message)
                router.push('/dashboard');
                // console.log(result);
                // console.log("ok" , res.ok)
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
            alert('fetch Failed: ' + err);
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.login_container}>
                <h2>Crud NextJS + NestJS</h2>
                <form onSubmit={login}>
                    <div className="mb-3">
                        <input className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input className="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" name="submit" className={styles.login_btn}>sign in</button>
                    <Link href="/register">
                        <button className={styles.login_btn}>sign up</button>
                    </Link>
                </form>
            </div>
        </div>
    );
}


