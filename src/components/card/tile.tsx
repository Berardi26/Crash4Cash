const TileCard = (props: any) => {
  const { children } = props

  return (
    <div className="group w-full bg-gradient-to-t from-[#222222] to-[#303030] rounded-[15px] p-[3px] cursor-pointer mb-4 pointer-events-none md:pointer-events-auto gb-blur-background-image opacity-100 transform-none origin-center" >
      <div className="w-full h-[62px] shadow-bet rounded-[13px] bg-gradient-to-b from-[#352e2e] to-[#221a1a] p-[3px] relative overflow-hidden gb-blur-background-image">
        <div className="flex justify-between items-center w-full h-full rounded-[11px] bg-gradient-to-b from-[#241c1c] to-[#221a1a] p-2 gb-blur-background-image">
          {children}
        </div>
      </div>
    </div>
  )
}

export default TileCard;