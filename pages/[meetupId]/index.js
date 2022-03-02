import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const MeetupDetails = (props) => {
  const { image, title, address, description } = props.meetupDatas;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <MeetupDetail
        title={title}
        image={image}
        address={address}
        description={description}
      />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://saman:yIwLIvX5HDOLiZL4@cluster0.bgedc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((value) => ({
      params: {
        meetupId: value._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://saman:yIwLIvX5HDOLiZL4@cluster0.bgedc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });
  client.close();

  return {
    props: {
      meetupDatas: {
        id: meetup._id.toString(),
        title: meetup.title,
        image: meetup.image,
        description: meetup.description,
        address: meetup.address,
      },
    },
    revalidate: 1,
  };
}
export default MeetupDetails;
