import Image from 'next/image'

import whatsAppIcon from '@/assets/icons/whatsappLogo.svg'

function LetsTalkButton({ className }: { className?: string }) {
  return (
    <button className={className + " text-center rounded-xl py-2 px-3 hover:scale-97 active:scale-102 cursor-pointer transition-all duration-300 ease-in-out"}>
      Click, let&apos;s talk!
      <Image
        src={whatsAppIcon}
        alt="WhatsApp Icon"
        className="ml-2 mb-1 h-4 w-4 inline-block"
      />
      &nbsp;&nbsp;&#x276F;
    </button>
  )
}

export default LetsTalkButton
