import sketchBalay from '../../../Images/sketch/balay.jpg';

export default function PublicBackground() {
    return (
        <div className="public-bg" aria-hidden="true">
            {/* Municipal Hall Architectural Sketch Background */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                <img
                    src={sketchBalay}
                    alt="Municipal Hall Sketch"
                    className="w-[96vw] max-w-6xl max-h-[85vh] object-contain select-none pointer-events-none transition-opacity duration-300 mix-blend-multiply opacity-25 dark:opacity-15 dark:invert dark:mix-blend-screen"
                />
            </div>

            {/* Architectural Grid Coordinates Overlay */}
            <div className="absolute inset-0 public-grid-pattern opacity-30 dark:opacity-20 pointer-events-none" />
        </div>
    );
}
