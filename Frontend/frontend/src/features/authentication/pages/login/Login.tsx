import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box } from "../../components/box/Box";
import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import { Layout } from "../../components/layout/Layout";
import { Seperator } from "../../components/seperator/Seperator";
import classes from "./Login.module.scss";
import { useState, type FormEvent } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";

export function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const { login } = useAuthentication()
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const doLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;
        
        try {
            await login(email, password);
            const destination = location.state?.from || "/";
            navigate(destination);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Layout className={classes.root}>
            <Box>
                <h1>Sign in</h1>
                <p>Stay updated on your professional world.</p>
                <form onSubmit={doLogin}>
                    <Input type="text" id="email" label="Username" onFocus={()=>setErrorMessage("")}/>
                    <Input type="password" id="password" label="Password" onFocus={()=>setErrorMessage("")} />
                    {errorMessage && <p className={classes.error}>{errorMessage}</p>}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "..." : "Sign in"}
                    </Button>
                </form>
                <Seperator>Or</Seperator>
                <div className={classes.register}>
                    New to LinkedIn? <Link to="/signup">Join now</Link>
                </div>
            </Box>
        </Layout>
    );
}