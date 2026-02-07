import Header from '@/components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - Global Trends Bubble',
    description: 'Global Trends Bubble provides real-time visualization of trending topics from around the world.',
    openGraph: {
        title: 'About Us - Global Trends Bubble',
        description: 'Learn more about Global Trends Bubble and our mission to visualize the world\'s trending topics.',
        type: 'website',
    }
};

export default function About() {
    return (
        <div className="scroll-container">
            <Header />

            <main className="main-container" style={{ padding: '2rem 0', minHeight: '60vh' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        marginBottom: '2rem',
                        color: 'var(--text-primary)',
                        background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>About Us</h1>

                    <div style={{ lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            <strong style={{ color: 'var(--accent-primary)' }}>Global Trends Bubble</strong> is a cutting-edge web application designed to visualize the pulse of the internet in real-time. By aggregating search volume data from across the globe, we provide an intuitive and interactive way to discover what capturing the world's attention right now.
                        </p>

                        <p style={{ marginBottom: '1.5rem' }}>
                            Our interactive treemap visualization allows you to instantly gauge the relative popularity of topics across diverse categories including
                            <span style={{ color: '#fff', fontWeight: 500 }}> Technology</span>,
                            <span style={{ color: '#fff', fontWeight: 500 }}> Entertainment</span>,
                            <span style={{ color: '#fff', fontWeight: 500 }}> Sports</span>,
                            <span style={{ color: '#fff', fontWeight: 500 }}> Politics</span>, and
                            <span style={{ color: '#fff', fontWeight: 500 }}> Business</span>.
                        </p>

                        <p>
                            We believe that data visualization is key to understanding complex information. Our mission is to transform abstract search metrics into meaningful insights, helping journalists, marketers, researchers, and curious minds stay ahead of the curve.
                        </p>
                    </div>
                </div>
            </main>

            <footer role="contentinfo" style={{
                background: 'rgba(9, 11, 17, 0.95)',
                padding: '4rem 2rem',
                marginTop: 'auto',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-subtle)'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{
                            color: 'var(--accent-primary)',
                            marginBottom: '1rem',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Global Trends Bubble
                        </h3>
                        <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            Visualizing the world's interests in real-time. Navigate the noise and discover what truly matters.
                        </p>
                    </div>

                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        paddingTop: '2rem',
                        fontSize: '0.85rem',
                        opacity: 0.8
                    }}>
                        <p>&copy; {new Date().getFullYear()} Global Trends Bubble. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
