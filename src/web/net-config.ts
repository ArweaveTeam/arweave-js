export interface NetConfig {
	protocol: string,
	host: string,
	port?: number,
}

/** exhaustive localhost testing */
const isLocal = (protocol: string, hostname: string)=>{
	const regexLocalIp = /^(127|10)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/

	const split = hostname.split('.')
	const tld = split[split.length - 1]	// check if subdomain on the localhost

	const localStrings = ["localhost", "[::1]"] 

	return localStrings.includes(hostname) || protocol == "file" 
		|| localStrings.includes(tld) || !!hostname.match(regexLocalIp) || !!tld.match(regexLocalIp)
} 

const hasTxidPath = (pathname: string)=>{
	let test = pathname
	test = test.replace(/\//g,'')
	console.log(`to match`, test)
	const digestRegex = /^[a-z0-9-_]{43}$/i
	return !!test.match(digestRegex)
}

/** matches any ipv4 address */
const isIpAdress = (host: string)=> {
	const regexMatchIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/ 
	
	return !!host.match(regexMatchIp)
}

export const getDefaultConfig = (protocol: string, host: string, pathname: string): NetConfig=>{

	// If we're running in what looks like a local dev environment
	// then default to using arweave.net
	if(isLocal(protocol, host)){
		return {
			protocol: "https",
			host: "arweave.net",
			port: 443,
		};
	}

	// No ArNS
	if(hasTxidPath(pathname)){
		return {
			protocol, 
			host,
		};
	}

	//check if hostname is an IP address
	if(!isIpAdress(host)){
		let split = host.split('.')
		if(split.length >=3){
			//if we got this far we must have an arns domain or non-GW domain (see note below)
			split.shift()
			const arnsHost = split.join('.')
			return {
				protocol,
				host: arnsHost,
			}
		}
	}

	// there are 2 potential garbage returns here: 
	// a non-GW ip address & a non-GW hostname without ArNS. garbage in, garbage out.
	// they should be overridden with user inputs in apiConfig.
	return {
		protocol,
		host,
	};
}

