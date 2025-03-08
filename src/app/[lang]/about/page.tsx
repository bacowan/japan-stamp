
interface AboutPageParams {
    params: Promise<{ id: string, lang: 'en-US' | 'ja' }>
}

export default function About() {
    return <div className="p-4">
        <h1 className="text-center text-4xl pb-4">About</h1>
        <p className="indent-4 pl-8">ekistamp.com is a website for those who love to collect stamps (the ink kind) from around Japan. With ekistamp.com, you can search through stamps which other users have uploaded and upload your own. We hope that you can grow your collection along with us!</p>

        <h2 className="text-2xl p-2">How Do You Collect Stamps?</h2>
        <p className="indent-4 pl-8">Stamps are spread out throught Japan and are located at points of interest: tourist spots, museums, train stations, etc. You can buy stamp books which you can put these stamps into when you find them. Many of the points of interest will have a dedicated flyer which you can put the stamp on and bring home with you as well.</p>

        <p className="indent-4 pl-8">One of the most popular places to collect stamps are at train stations. The Japanese word for "station" is "eki", hence the website name "eki stamp".</p>

        <h2 className="text-2xl p-2">The Future of the Website</h2>
        <p className="indent-4 pl-8">ekistamp.com is in its early stages. It might not look like much yet, but you can keep track of its progress on our <a href="https://github.com/bacowan/japan-stamp/milestones">milestone tracker.</a> Some features that you can look forward to include:</p>
        <ul className="list-disc ml-20">
            <li>Searching for stamps on a map;</li>
            <li>Uploading and editing stamps yourself;</li>
            <li>Keeping track of what stamps you have collected</li>
        </ul>

        <h2 className="text-2xl p-2">Who Makes Ekistamp?</h2>
        <p className="indent-4 pl-8">That's me! I'm Brendan, but you will probably see me on here as my internet handle, DoomInAJar. Programming is one of my hobbies along with collecting stamps!</p>

        <h2 className="text-2xl p-2">How Can I Contact You?</h2>
        <p className="indent-4 pl-8">If you have feature requests or bug reports, the best way to do it is by creating an issue in github. For anything admin related, you can contact admin@ekistamp.net.</p>
    </div>
}