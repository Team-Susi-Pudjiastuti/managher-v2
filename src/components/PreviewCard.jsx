'use client';

export default function PreviewCard({ title, items }) {
  const isEmpty = !items || items.length === 0 || items.every(item => !item.value || item.value === '-');

  return (
    <div
      className="font-sans"
      style={{
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderTopWidth: '1px',
        borderLeftWidth: '1px',
        borderBottomWidth: '4px',
        borderRightWidth: '4px',
        borderColor: '#000000',
        boxShadow: '4px 4px 0 0 #000000',
      }}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#000000] font-sans mb-4">{title}</h3>

        {isEmpty ? (
          <p className="text-[#000000] text-sm font-sans font-light italic">
            Belum ada data yang diisi.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex justify-between py-1 font-sans"
                style={{
                  borderBottom: i < items.length - 1 ? '1px solid #e5e5e5' : 'none',
                }}
              >
                <span className="text-[#000000] text-sm font-sans font-light">{item.label}</span>
                <span className="text-[#000000] text-sm font-sans font-medium">{item.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}