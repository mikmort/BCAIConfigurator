import React from 'react';

interface Props {
  show: boolean;
  reasoning: string;
  onClose: () => void;
}

export default function InfoPopup({ show, reasoning, onClose }: Props) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{reasoning}</p>
      </div>
    </div>
  );
}
