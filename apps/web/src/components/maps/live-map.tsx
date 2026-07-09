'use client';

interface LiveMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
  label?: string;
}

export function LiveMap({ latitude, longitude, zoom = 15, className = 'h-64 w-full', label }: LiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  const src = apiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=${zoom}&maptype=roadmap`
    : `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
      <iframe
        title={label ?? 'Live map'}
        src={src}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="absolute bottom-3 left-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium shadow">
        {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </div>
    </div>
  );
}
