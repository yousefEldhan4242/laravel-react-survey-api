
const DashboardCard = ({title,children,className="",style}) => {
  return (
    <div className={"bg-white shadow-md p-3 text-center flex flex-col animate-fade-in-down" + className}
          style={{
        animation: `fade-in-down 0.2s ease-in-out ${style?.animationDelay || '0s'} both`,
        ...style
      }}
    >
      {title && <h3 className="text-2xl font-semibold">{title}</h3>}
      {children}
    </div>
  )
}

export default DashboardCard
