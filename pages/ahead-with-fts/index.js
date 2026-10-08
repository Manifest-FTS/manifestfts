export async function getServerSideProps() {
  return { redirect: { destination: '/insights', permanent: true } };
}

export default function LegacyInsightsIndex() {
  return null;
}
