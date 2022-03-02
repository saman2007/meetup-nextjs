import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>react meetups</title>
        <meta
          name="description"
          content="my first project using next js! a meetup project!"
        />
      </Head>
      <MeetupList meetups={props.meetupDatas} />
    </>
  );
};

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://saman:yIwLIvX5HDOLiZL4@cluster0.bgedc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetupDatas: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 60,
  };
}

export default HomePage;
