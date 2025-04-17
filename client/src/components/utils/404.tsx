export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen px-[5%]">
            <h1 className="sm:text-4xl text-3xl font-bold text-white text-center">404 - Not Found</h1>
            <p className="mt-4 sm:text-lg text-base text-gray-400 text-center">The page you are looking for does not exist.</p>
            <a href="/" className="mt-6 sm:text-base text-sm text-blue-500 hover:underline text-center">Go back to Home</a>
        </div>
    );
}