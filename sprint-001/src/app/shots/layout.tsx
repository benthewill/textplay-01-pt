export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row">
            <div className="flex-grow p-24">{children}</div>
        </div>
        );
}