<script lang="ts">
	import { page } from '$app/state';
	import { authRoutes } from '$lib/constants/route';
</script>

<div class="login__container">
    <!-- form login -->
    <div class="form-login">
        <div class="title pb-1.5 text-[#1E1E24]">
            <h2>Authenticate Yourself</h2>
        </div>

        <!-- error feedback -->
        {#if page.url.searchParams.get('error')}
            <div style="color: #b91c1c; background-color: #fee2e2; padding: 0.75rem 1rem; border-radius: 0.25rem; margin-bottom: 1.5rem; max-width: 262px;">
                <strong>Access Denied:</strong> {page.url.searchParams.get('error')}
            </div>
        {/if}

        <!-- button container -->
        <a href={authRoutes.REDIRECT_TO_GOOGLE} rel="external" class="flex items-center gap-2 px-6 py-3 bg-[#824C71] text-[#f4f3ee] rounded-sm hover:opacity-[95%]">
            <svg width="28px" height="28px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
            Login with Google
        </a>

        <!-- <span class="divider">
            <span class="divider-line"></span>
            <span>or</span>
            <span class="divider-line"></span>
        </span>

        <button class="fingerprint-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="30px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint-pattern-icon lucide-fingerprint-pattern"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/></svg>
            Use fingerprint
        </button> -->

        <!-- help -->
        <div class="troubleshoot">
            Having problems? Contact the 
            <span><a href="https://althaf-profile.netlify.app/" target="_blank">developer</a></span>
        </div>
    </div>
</div>

<style>
    a {
        text-decoration: none;
        color: white;
    }

    .login__container {
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        padding: 2rem;
        gap: 5.75rem;
        background-color: #f4f3ee;
        height: 100vh;
    }

    .form-login {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-inline: auto;
        margin-top: 12.5vh;
        height: 50vh;
        width: 290px;
    }

    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title h2 {
        font-size: 1.25rem;
        font-weight: 500;
        text-align: center;
    }

    .login-btn, .fingerprint-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        border: 1px solid grey;
        background-color: white;
        color: black;
        font-weight: 500;
        font-size: 1rem;
        padding: 0.75rem 0;
        border-radius: 0.25rem;
        transition: all 0.3s ease;
        width: 100%;
        cursor: pointer;
    }

    .divider {
        margin-block: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .divider-line {
        width: 122px;
        height: 1px;
        background-color: rgba(128, 128, 128, 0.311);
    }

    .login-btn:hover, .fingerprint-btn:hover {
        background-color: black;
        color: white;
    }

    .troubleshoot {
        font-size: 0.85rem;
        opacity: 70%;
        text-align: center;
        margin-top: 1rem;
    }

    .troubleshoot span, .troubleshoot span a {
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        color: black;
    }

    .troubleshoot span:hover {
        text-decoration: underline;
    }
</style>