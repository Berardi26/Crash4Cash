import { addToast, Button, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, useDisclosure } from '@heroui/react';
import TileCard from '../card/tile';
import { FaCrown } from 'react-icons/fa6';
import { BaseUser } from '@/types/types';
import { useEffect, useState } from 'react';

const CrashGameModal = (props: any) => {

  const { game, open, setOpen } = props

  const [winner, setWinner] = useState<{ status: string, user: BaseUser }>()
  const onClose = () => {
    setOpen(false)
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open)
  }


  useEffect(() => {
    setWinner(game?.players.filter((p: any) => p.status === "WIN")[0])
  }, [game])

  return (
    <Modal isOpen={open} backdrop='blur' placement={`auto`} onOpenChange={onOpenChange} size='xl' >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Round #{game?.round}</ModalHeader>

            <ModalBody>
              {winner ? <div className='flex flex-col items-center'>
                <p>Winner</p>
                <div className=''>
                  <Image src={winner?.user?.avatar ?? "/assets/images/avatar/default.webp"} className='w-40 h-40' alt='winner' />
                </div>
                <p className='text-white text-center font-bold text-2xl'>{game?.players.filter((p: any) => p.status === "WIN")[0]?.user?.username}</p>
              </div>:
              <div className=' flex flex-col items-center'>
                <p>No winner for this round.</p>
                <Image src={`/assets/images/avatar/default.webp`} alt='nowinner' className='w-40 h-40' />
              </div>
              }
              <div className=''>
                <p className='text-white'>Crashed: <span className='text-white/40'>{new Date(game?.createdAt!).toLocaleTimeString("en-GB", { hour12: false })}</span></p>
              </div>
              <div className='gap-2 items-center flex flex-col'>
                {game?.players.map((user: any, idx: number) => (
                  <TileCard key={idx} className="w-full justify-between">
                    <div className="flex items-center gap-2" >
                      <div className="flex items-center">
                        <div className="rounded-[8px] overflow-hidden border-[1px] aspect-square hover:brightness-125 duration-300 cursor-pointer w-12 h-12 transition-[filter] will-change-[filter] group-hover:brightness-125 shrink-0 shadow-[0px_1.48px_0px_0px_#FFFFFF1A_inset] bg-[#303045] p-[1px] border-none">
                          <div className="w-full h-full p-0.5 border-[1px] border-[#222222] relative overflow-hidden rounded-[10px]">
                            <Image src={user?.user?.avatar ?? "/assets/images/avatar/default.webp"} className="object-cover object-center w-full h-full rounded-md gb-blur-image" alt="" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-1 ml-2 -top-[2px] relative">
                        <p className="text-sm font-book text-[#C4C4C4]  truncate">{user?.user?.username}</p>
                        <div className="p-[1px] rounded-md overflow-hidden bg-[#2A417C] text-[#60AAFF]">
                          <div className="flex items-center justify-center rounded-[5px] overflow-hidden bg-[#22222D]/80 font-semibold w-[28px] h-5 text-[11px]">{21}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className='text-white'>{user?.status}</p>
                      {user?.status === "WIN" && <FaCrown className='text-xl text-success' />}
                    </div>
                  </TileCard>))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CrashGameModal