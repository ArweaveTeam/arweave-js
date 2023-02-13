export interface NetConfig {
	protocol: string,
	host: string,
	port?: number,
}

/** exhaustive localhost testing */
const isLocal = (protocol: string, hostname: string)=>{
	const regexLocalIp = /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/

	const split = hostname.split('.')
	const tld = split[split.length - 1]	// check if subdomain on the localhost

	const localStrings = ["localhost", "[::1]"]

	return localStrings.includes(hostname) || protocol == "file" 
		|| localStrings.includes(tld) || !!hostname.match(regexLocalIp) || !!tld.match(regexLocalIp)
} 

/** simplified tests for ip addresses */
const isIpAdress = (host: string)=> {
	// an IPv6 location.hostname (and only IPv6 hostnames) must be surrounded by square brackets
	const isIpv6 = host.charAt(0) === '['
	// Potential speed-up for IPv4 detection:
	// the tld of a domain name cannot be a number (IDN location.hostnames appear to be converted, needs further clarification)
	const regexMatchIpv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/ 
	
	return !!host.match(regexMatchIpv4) || isIpv6
}

export const getDefaultConfig = (protocol: string, host: string): NetConfig=>{

	// If we're running in what looks like a local dev environment
	// then default to using arweave.net
	if(isLocal(protocol, host)){
		return {
			protocol: "https",
			host: "arweave.net",
			port: 443,
		};
	}

	//check if hostname is an IP address before removing first subdomain
	if(!isIpAdress(host)){
		let split = host.split('.')
		if(split.length >=3){
			split.shift()
			const parentDomain = split.join('.')
			return {
				protocol,
				host: parentDomain,
			}
		}
	}

	// there are 2 potential garbage returns here: 
	// a non-GW ip address & a non-GW hostname without ArNS. garbage in, garbage out.
	// they should be overridden with user inputs in apiConfig.
	// otherwise we have a valid ip based GW address.
	return {
		protocol,
		host,
	};
}

