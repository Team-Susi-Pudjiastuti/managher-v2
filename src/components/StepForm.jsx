'use client';

export default function StepForm({
  title,
  placeholder,
  value,
  onChange,
  onNext,
  onBack,
  isLast = false,
}) {
  const isDisabled = !value?.trim();

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
        <h2 className="text-xl font-bold text-[#000000] font-sans mb-4">{title}</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 outline-none font-sans"
            style={{
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
            }}
          />
          <div className="flex justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className="bg-[#ffcccc] text-[#000000] px-5 py-2 font-semibold font-sans hover:bg-[#ffa8a8] transition-colors"
                style={{
                  borderStyle: 'solid',
                  borderTopWidth: '1px',
                  borderLeftWidth: '1px',
                  borderBottomWidth: '4px',
                  borderRightWidth: '4px',
                  borderColor: '#000000',
                  borderRadius: '0',
                }}
              >
                ← Kembali
              </button>
            )}
            <div className="ml-auto">
              <button
                onClick={onNext}
                disabled={isDisabled}
                className={`px-5 py-2 font-semibold font-sans transition-colors ${
                  isDisabled
                    ? 'bg-[#f0f0f0] text-[#333333] cursor-not-allowed'
                    : 'bg-[#b80000] text-white hover:bg-[#8B0000]'
                }`}
                style={{
                  borderStyle: 'solid',
                  borderTopWidth: '1px',
                  borderLeftWidth: '1px',
                  borderBottomWidth: '4px',
                  borderRightWidth: '4px',
                  borderColor: '#000000',
                  borderRadius: '0',
                }}
              >
                {isLast ? 'Selesai' : 'Lanjut'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}