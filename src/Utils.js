export function compareVersions(version1, version2) {
    const parts1 = version1.split(/[\.-]/).map(part => isNaN(part) ? -1 : Number(part));
    const parts2 = version2.split(/[\.-]/).map(part => isNaN(part) ? -1 : Number(part));

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;

        if (part1 > part2) {
            return 1;
        } else if (part1 < part2) {
            return -1;
        }
    }

    return 0;
}

export function parseTextWithUrls(text) {
    const urlRegex = /<url="([^"]+)">([^<]+)<\/url>/g;
    let match;
    let lastIndex = 0;
    const elements = [];

    while ((match = urlRegex.exec(text)) !== null) {
        if (match.index !== lastIndex) {
            elements.push(text.substring(lastIndex, match.index));
        }

        elements.push(<a key={lastIndex} style={{ color: 'white' }} href={match[1]} target="_blank">{match[2]}</a>);

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex !== text.length) {
        elements.push(text.substring(lastIndex));
    }

    return elements;
};