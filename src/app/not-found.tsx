"use client";

export default function NotFound() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-brand-orange dark:text-brand-orange">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
                    <a href="/" className="inline-flex text-white bg-brand-orange hover:bg-brand-orange-hover focus:ring-4 focus:outline-none focus:ring-brand-orange/30 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back to Homepage</a>
                </div>
            </div>
        </section>
    );
}
