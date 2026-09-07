import sketchBalay from '../../../Images/sketch/balay.jpg';

export default function PublicBackground() {
    return (
        <div className="public-bg" aria-hidden="true">
            {/* Municipal Hall Architectural Sketch — Full Background Fill */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <img
                    src={sketchBalay}
                    alt="Municipal Hall Sketch"
                    className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 mix-blend-multiply opacity-[0.22] dark:opacity-[0.14] dark:invert dark:mix-blend-screen"
                />
            </div>

            {/* Architectural Grid Coordinates Overlay */}
            <div className="absolute inset-0 public-grid-pattern opacity-30 dark:opacity-20 pointer-events-none" />
        </div>
    );
}
