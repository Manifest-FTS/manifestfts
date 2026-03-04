export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/case-study/sanity-cms",
      permanent: true,
    },
  };
}

export default function LegacySanityCMSRoute() {
  return null;
}