import { useCallback, useMemo, useState } from "react";
import {
  Biome,
  EdDSAFrogPCD,
  EdDSAFrogPCDPackage,
  Temperament,
  initArgs,
  IFrogData,
} from "@pcd/eddsa-frog-pcd";
import styled from "styled-components";
import styles from "../styles/Home.module.css";
/**
 * Returns the data inside of this PCD if it exists.
 */
const getEdDSAFrogData = (pcd?: EdDSAFrogPCD): IFrogData | undefined => {
  return pcd?.claim?.data;
};

export const FrogCard = ({
  pcd,
  isDead,
}: {
  pcd: EdDSAFrogPCD | undefined;
  isDead: boolean;
}) => {
  const frogData = useMemo(() => getEdDSAFrogData(pcd), [pcd]);
  const [showMore, setShowMore] = useState(false);
  const [showPCD, setShowPCD] = useState(false);

  if (!frogData) {
    return <Container></Container>;
  }

  return (
    <Container>
      <h2 className={styles.frogName}>{frogData.name}</h2>
      {/* <h3>{isDead ? "alive... for now" : "you killed it"}</h3> */}
      <div className={styles.frog}>
        {/* <img className={styles.blood} src="blood.png" /> */}
        <FrogImg src={frogData?.imageUrl} draggable={false} />
      </div>

      <FrogInfo>
        <FrogAttribute label="JUMP" title="Jump" value={frogData.jump} />
        <FrogAttribute
          label="TMPT"
          title="Temperament"
          value={temperamentValue(frogData.temperament)}
        />
        <FrogAttribute label="SPD" title="Speed" value={frogData?.speed} />
        <FrogAttribute
          label="INT"
          title="Intelligence"
          value={frogData.intelligence}
        />
        <FrogAttribute label="BUTY" title="Beauty" value={frogData.beauty} />
      </FrogInfo>
      {pcd && <CopyFrogPCD pcd={pcd} />}
      {/* <a onClick={() => setShowPCD(true)}>View as proof-carrying data</a> */}
      {showMore && (
        <>
          <Description>{frogData.description}</Description>
          <FrogInfo>
            <FrogAttribute
              label="Signed at"
              title={`Signed at: ${frogData.timestampSigned}`}
              value={new Date(frogData.timestampSigned).toLocaleDateString()}
            />
            <FrogAttribute
              label="Source"
              title="Biome"
              value={biomeValue(frogData.biome)}
            />
          </FrogInfo>
        </>
      )}
      <button onClick={() => setShowMore(!showMore)}>
        {showMore ? "Collapse" : "See more"}
      </button>
    </Container>
  );
};

function FrogAttribute({
  label,
  title,
  value,
}: {
  label: string;
  title: string;
  value: string | number | undefined;
}) {
  return (
    <Attribute>
      <AttrTitle title={title}>{label}</AttrTitle>
      <AttrValue style={{ color: attrColor(value) }}>{value}</AttrValue>
    </Attribute>
  );
}

function attrColor(value: string | number | undefined) {
  if (typeof value === "number") {
    if (value <= 3) {
      return "#a95940";
    }
    if (value >= 7) {
      return "#206b5e";
    }
  }
}

function temperamentValue(temperament: Temperament) {
  switch (temperament) {
    case Temperament.UNKNOWN:
      return "???";
    case Temperament.N_A:
      return "N/A";
    default:
      return Temperament[temperament];
  }
}

function biomeValue(biome: Biome) {
  return Biome[biome];
}

function CopyFrogPCD({ pcd }: { pcd: EdDSAFrogPCD }) {
  const [copied, setCopied] = useState(false);
  const onClick = useCallback(async () => {
    const serialized = await EdDSAFrogPCDPackage.serialize(pcd);
    navigator.clipboard.writeText(JSON.stringify(serialized));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [pcd]);

  return <a onClick={onClick}>{copied ? "Copied!" : "Copy frog PCD"}</a>;
}

const Container = styled.div`
  padding: 16px;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const FrogInfo = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 16px;
`;

const FrogImg = styled.img`
  width: 100%;
  height: auto;
  z-index: -99;
`;

const Description = styled.div`
  font-size: 14px;
  color: rgba(var(--white-rgb), 0.8);
`;

const Attribute = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const AttrTitle = styled.div`
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
`;

const AttrValue = styled.div`
  font-size: 14px;
`;
