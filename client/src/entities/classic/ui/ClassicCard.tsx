import "./ClassicCard.css";
import type { ClassicType } from "@/entities/classic/model";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ClassicCardProps = {
  classic: ClassicType | null;
};

export default function ClassicCard({ classic }: ClassicCardProps) {
  const router = useRouter();

  if (!classic) {
    return null; // или можно отобразить заглушку, если данных нет
  }
  return (
    <div>
      <div>
        <Image
          src={classic.image}
          alt={classic.name}
          width={400} // обязательный пропс
          height={300} // обязательный пропс
        />
      </div>
      <h4>{classic.name}</h4>
      <p>{classic.description}</p>
      <p>{classic.price}</p>
      <button>Выбрать услугу</button>
      <button  onClick={() => {router.push(`/classic/${classic.id}`)}}>Подробнее</button>
    </div>
  );
}
