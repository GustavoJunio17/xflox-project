import React from 'react';
import Head from 'next/head';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>Login - XFlow</title>
      </Head>
      <LoginForm />
    </div>
  );
}
