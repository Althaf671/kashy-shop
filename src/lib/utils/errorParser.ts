/**
 * @example error from other service is { name: Invalid name format. } to Invalid name format.
 */
export function parseErrorDescription(description?: string): Record<string, string> {
    if (!description) return {};

    return description.split(',').reduce((acc, desc) => {
        const [field, ...msgParts] = desc.split(':');
        
        const message = msgParts.join(':').trim(); 
        
        if (field) {
            acc[field.trim()] = message.charAt(0).toUpperCase() + message.slice(1);
        }
        
        return acc;
    }, {} as Record<string, string>);
}