
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const PropertyMarker = ({ property, isSelected, onClick }) => {
  const lat   = property.latitude  ?? property.lat;
  const lng   = property.longitude ?? property.lng;
  const price = property.price     ?? property.amount ?? '';

  if (!lat || !lng) return null;

  const icon = L.divIcon({
    className: '',
    //  iconAnchor centers the bubble above the point
    iconAnchor: [40, 44],
    iconSize:   [80, 44],
    html: `
      <div style="
        display:flex;flex-direction:column;align-items:center;
        transform:${isSelected ? 'scale(1.12)' : 'scale(1)'};
        transition:transform 0.15s;
        pointer-events:auto;
      ">
        ${isSelected ? `<div style="
          position:absolute;top:-4px;left:50%;
          transform:translateX(-50%);
          width:48px;height:48px;border-radius:50%;
          background:rgba(245,158,11,0.25);
          animation:mpng 1s cubic-bezier(0,0,0.2,1) infinite;
        "></div>` : ''}
        <div style="
          padding:6px 12px;border-radius:999px;
          font-size:13px;font-weight:700;
          font-family:'DM Sans',sans-serif;white-space:nowrap;
          background:${isSelected ? 'linear-gradient(135deg,#F59E0B,#F97316)' : '#ffffff'};
          color:${isSelected ? '#fff' : '#1C2A3A'};
          box-shadow:0 2px 10px rgba(0,0,0,0.18);
          border:2px solid ${isSelected ? 'transparent' : '#f3f4f6'};
        ">${price}</div>
        <div style="
          width:0;height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:8px solid ${isSelected ? '#F97316' : '#ffffff'};
          margin-top:-1px;
        "></div>
      </div>
      <style>
        @keyframes mpng{0%{transform:translateX(-50%) scale(1);opacity:.6}100%{transform:translateX(-50%) scale(2.2);opacity:0}}
      </style>
    `,
  });

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{
        click: (e) => {
          // Stop map from also receiving this click
          L.DomEvent.stopPropagation(e);
          onClick(property);
        },
      }}
    />
  );
};

export default PropertyMarker;
