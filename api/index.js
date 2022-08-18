import axios from "axios";

const cutLongString = (str, n = 25) => (str?.length > n ? `${str.substr(0, n - 1)}…` : str);

const generateText = (username, packagesList, period) => {
    let count = 15;
    const height = 50 + packagesList.length * 60;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="${height}" viewBox="0 0 495 ${height}" role="img">
<style>
text{
    font-family:'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
}
</style>
<title>${username}'s packages stats - ${period}</title>
<svg viewBox="0 0 24 24" height="24" width="24" x="20" fill="#2f80ed">
<path d="M18.32 4.26C16.84 3.05 15.01 2.25 13 2.05v2.02c1.46.18 2.79.76 3.9 1.62l1.42-1.43zM19.93 11h2.02c-.2-2.01-1-3.84-2.21-5.32L18.31 7.1c.86 1.11 1.44 2.44 1.62 3.9zm-1.62 5.9 1.43 1.43c1.21-1.48 2.01-3.32 2.21-5.32h-2.02c-.18 1.45-.76 2.78-1.62 3.89zM13 19.93v2.02c2.01-.2 3.84-1 5.32-2.21l-1.43-1.43c-1.1.86-2.43 1.44-3.89 1.62zM13 12V7h-2v5H7l5 5 5-5h-4zm-2 7.93v2.02c-5.05-.5-9-4.76-9-9.95s3.95-9.45 9-9.95v2.02C7.05 4.56 4 7.92 4 12s3.05 7.44 7 7.93z"></path>
</svg>
<text class="stat bold" x="55" y="20" font-size="20">${username}'s packages - ${period}</text>
${packagesList.reduce((previous, current) => {
    const txt = `${previous}\n
<svg>
<title>${current.name}</title>
<a href="https://www.npmjs.com/package/${current.name}">
<g transform="translate(0, ${25 + count})">
<text class="stat bold" x="25" y="${count + 10}" font-size="15">${current.downloads}</text>
<text class="stat bold" x="55" y="${count}" font-size="15">${cutLongString(current.name, 50)}</text>
<text class="stat" x="55" y="${count + 20}" font-size="15" >${cutLongString(current.description, 70)}</text>
</g>
</a>
</svg>`;
    count = count + 27;
    return txt;
}, "")}
</svg>`;
};

const getPackagesOfUser = async (username) => {
    const url = `https://registry.npmjs.org/-/v1/search?text=author:${username}`;
    return axios
        .get(url)
        .then(({ data }) => {
            return data?.objects.map(({ package: x }) => x) || [];
        })
        .catch(() => {
            return [];
        });
};

const getDownloads = async (names, period) => {
    const url = `https://api.npmjs.org/downloads/point/${period}/${names || ","}`;
    return axios
        .get(url)
        .then(({ data }) => {
            const { [""]: _notUsed, ...rest } = data;
            return rest || {};
        })
        .catch(() => {
            return {};
        });
};

export default async (request, response) => {
    const username = request?.query?.username || "n4n5";
    console.log(username);
    const period = request?.query?.period || "last-week";
    const packages = await getPackagesOfUser(username);
    const packagesNames = packages.reduce((previous, current) => `${previous},${current.name}`, "");
    const downloads = await getDownloads(packagesNames, period);
    const packagesList = Object.keys(downloads).reduce((lastValue, currentValue) => {
        if (currentValue !== "") {
            const correctPackage = packages.find((onePackage) => onePackage.name === currentValue) || {};
            return [
                ...lastValue,
                {
                    ...downloads[currentValue],
                    ...correctPackage,
                },
            ];
        }
        return lastValue;
    }, []);
    const svg = generateText(
        username,
        packagesList.sort((a, b) => (a.downloads < b.downloads ? 1 : -1)),
        period
    );
    if (response) {
        response.setHeader("Content-Type", "image/svg+xml");
        response.status(200).send(svg);
    } else {
        return svg;
    }
};
